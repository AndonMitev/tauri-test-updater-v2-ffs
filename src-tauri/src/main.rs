// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
  .plugin(
    tauri_plugin_stronghold::Builder::new(|password| {
        let config = argon2::Config {
            lanes: 2,
            mem_cost: 10_000,
            time_cost: 10,
            thread_mode: argon2::ThreadMode::from_threads(2),
            variant: argon2::Variant::Argon2id,
            ..Default::default()
        };

        let salt = b"some_long_and_secure_random_salt";
        let key = argon2::hash_raw(
            password.as_ref(),
            salt,
            &config,
        )
        .expect("failed to hash password");

        key.to_vec()
    })
    .build(),
).run(tauri::generate_context!())
    .expect("error while running tauri application");
}
