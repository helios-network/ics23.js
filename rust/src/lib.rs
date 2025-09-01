#![allow(clippy::large_enum_variant)]
extern crate alloc;
use wasm_bindgen::prelude::*;

use alloc::collections::BTreeMap;
use ics23::{
    self, iavl_spec as rs_iavl_spec, smt_spec as rs_smt_spec,
    tendermint_spec as rs_tendermint_spec, HostFunctionsManager,
};
use js_sys::{Array, Uint8Array};
use prost::Message as _;
use wasm_bindgen::JsCast;

mod utils;

fn to_js_error(err: &str) -> JsError {
    JsError::new(err)
}

#[wasm_bindgen]
pub fn default_iavl_spec() -> Vec<u8> {
    let spec = rs_iavl_spec();
    let mut buf = Vec::new();
    spec.encode(&mut buf).expect("encode proof spec");
    buf
}

#[wasm_bindgen]
pub fn default_tendermint_spec() -> Vec<u8> {
    let spec = rs_tendermint_spec();
    let mut buf = Vec::new();
    spec.encode(&mut buf).expect("encode proof spec");
    buf
}

#[wasm_bindgen]
pub fn default_smt_spec() -> Vec<u8> {
    let spec = rs_smt_spec();
    let mut buf = Vec::new();
    spec.encode(&mut buf).expect("encode proof spec");
    buf
}

#[wasm_bindgen]
pub fn verify_membership(
    proof_bytes: &[u8],
    spec_bytes: &[u8],
    root: &[u8],
    key: &[u8],
    value: &[u8],
) -> Result<bool, JsError> {
    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| to_js_error(&format!("failed to decode proof: {e}")))?;

    let spec = ics23::ProofSpec::decode(spec_bytes)
        .map_err(|e| to_js_error(&format!("failed to decode spec: {e}")))?;
    let ok =
        ics23::verify_membership::<HostFunctionsManager>(&proof, &spec, &root.to_vec(), key, value);
    Ok(ok)
}

#[wasm_bindgen]
pub fn verify_non_membership(
    proof_bytes: &[u8],
    spec_bytes: &[u8],
    root: &[u8],
    key: &[u8],
) -> Result<bool, JsError> {
    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| to_js_error(&format!("failed to decode proof: {e}")))?;

    let spec = ics23::ProofSpec::decode(spec_bytes)
        .map_err(|e| to_js_error(&format!("failed to decode spec: {e}")))?;
    let ok =
        ics23::verify_non_membership::<HostFunctionsManager>(&proof, &spec, &root.to_vec(), key);
    Ok(ok)
}

#[wasm_bindgen]
pub fn verify_batch_membership(
    proof_bytes: &[u8],
    spec_bytes: &[u8],
    root: &[u8],
    keys: Array,
    values: Array,
) -> Result<bool, JsError> {
    if keys.length() != values.length() {
        return Err(JsError::new("keys and values length mismatch"));
    }

    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode proof: {e}")))?;

    let spec = ics23::ProofSpec::decode(spec_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode spec: {e}")))?;

    let keys_vec = utils::array_to_vec_of_vec_u8(&keys)?;
    let vals_vec = utils::array_to_vec_of_vec_u8(&values)?;

    // Own the data, then build a BTreeMap<&[u8], &[u8]> referencing it
    let items_owned: Vec<(Vec<u8>, Vec<u8>)> =
        keys_vec.into_iter().zip(vals_vec.into_iter()).collect();
    let mut items_map: BTreeMap<&[u8], &[u8]> = BTreeMap::new();
    for (k, v) in &items_owned {
        items_map.insert(k.as_slice(), v.as_slice());
    }

    let ok = ics23::verify_batch_membership::<HostFunctionsManager>(
        &proof,
        &spec,
        &root.to_vec(),
        items_map,
    );
    Ok(ok)
}

#[wasm_bindgen]
pub fn verify_batch_non_membership(
    proof_bytes: &[u8],
    spec_bytes: &[u8],
    root: &[u8],
    keys: Array,
) -> Result<bool, JsError> {
    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode proof: {e}")))?;

    let spec = ics23::ProofSpec::decode(spec_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode spec: {e}")))?;

    let keys_vec = utils::array_to_vec_of_vec_u8(&keys)?;
    let mut key_refs: Vec<&[u8]> = Vec::with_capacity(keys_vec.len());
    for k in &keys_vec {
        key_refs.push(k.as_slice());
    }

    let ok = ics23::verify_batch_non_membership::<HostFunctionsManager>(
        &proof,
        &spec,
        &root.to_vec(),
        &key_refs,
    );
    Ok(ok)
}

#[wasm_bindgen]
pub fn compress_batch_proof(proof_bytes: &[u8]) -> Result<Vec<u8>, JsError> {
    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode proof: {e}")))?;
    let comp = ics23::compress(&proof)
        .map_err(|e| JsError::new(&format!("failed to compress proof: {e}")))?;
    let mut buf = Vec::new();
    comp.encode(&mut buf)
        .map_err(|e| JsError::new(&format!("failed to encode compressed proof: {e}")))?;
    Ok(buf)
}

#[wasm_bindgen]
pub fn decompress_batch_proof(comp_bytes: &[u8]) -> Result<Vec<u8>, JsError> {
    let mut comp = ics23::CommitmentProof { proof: None };
    comp.merge(comp_bytes)
        .map_err(|e| JsError::new(&format!("failed to decode proof: {e}")))?;
    let proof = ics23::decompress(&comp)
        .map_err(|e| JsError::new(&format!("failed to decompress proof: {e}")))?;
    let mut buf = Vec::new();
    proof
        .encode(&mut buf)
        .map_err(|e| JsError::new(&format!("failed to encode decompressed proof: {e}")))?;
    Ok(buf)
}

#[wasm_bindgen]
pub fn build_batch_proof(proofs: Array) -> Result<Vec<u8>, JsError> {
    let mut entries: Vec<ics23::BatchEntry> = Vec::new();
    for v in proofs.iter() {
        let u8a: Uint8Array = v
            .dyn_into()
            .map_err(|_| JsError::new("expected Uint8Array"))?;
        let bytes = u8a.to_vec();
        let mut proof = ics23::CommitmentProof { proof: None };
        proof
            .merge(bytes.as_slice())
            .map_err(|e| JsError::new(&format!("failed to decode proof: {e}")))?;
        match proof.proof {
            Some(ics23::commitment_proof::Proof::Nonexist(non)) => {
                entries.push(ics23::BatchEntry {
                    proof: Some(ics23::batch_entry::Proof::Nonexist(non)),
                });
            }
            Some(ics23::commitment_proof::Proof::Exist(ex)) => {
                entries.push(ics23::BatchEntry {
                    proof: Some(ics23::batch_entry::Proof::Exist(ex)),
                });
            }
            _ => return Err(JsError::new("unknown proof type for batch")),
        }
    }

    let batch = ics23::CommitmentProof {
        proof: Some(ics23::commitment_proof::Proof::Batch(ics23::BatchProof {
            entries,
        })),
    };
    let mut buf = Vec::new();
    batch
        .encode(&mut buf)
        .map_err(|e| JsError::new(&format!("failed to encode batch proof: {e}")))?;
    Ok(buf)
}

#[wasm_bindgen]
pub fn calculate_existence_root(proof_bytes: &[u8]) -> Result<Vec<u8>, JsError> {
    let mut proof = ics23::CommitmentProof { proof: None };
    proof
        .merge(proof_bytes)
        .map_err(|e| to_js_error(&format!("failed to decode proof: {e}")))?;

    if let Some(ics23::commitment_proof::Proof::Exist(exist_proof)) = proof.proof {
        let root = ics23::calculate_existence_root::<HostFunctionsManager>(&exist_proof)
            .map_err(|e| to_js_error(&format!("failed to calculate root: {e}")))?;
        Ok(root)
    } else {
        Err(to_js_error("Proof is not an ExistenceProof"))
    }
}
