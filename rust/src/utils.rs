use js_sys::{Array, Uint8Array};
use wasm_bindgen::prelude::JsError;
use wasm_bindgen::JsCast;

pub fn array_to_vec_of_vec_u8(arr: &Array) -> Result<Vec<Vec<u8>>, JsError> {
    let mut out: Vec<Vec<u8>> = Vec::with_capacity(arr.length() as usize);
    for v in arr.iter() {
        let u8a: Uint8Array = v
            .dyn_into()
            .map_err(|_| JsError::new("expected Uint8Array"))?;
        out.push(u8a.to_vec());
    }
    Ok(out)
}
