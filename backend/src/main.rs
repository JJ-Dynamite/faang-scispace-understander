use axum::{
    routing::{get, post},
    Router,
    Json,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[derive(Serialize)]
struct PaperExplanation {
    title: String,
    abstract_text: String,
    summary: String,
    key_concepts: Vec<String>,
    methodology: String,
    findings: Vec<String>,
    difficulty_level: String,
    estimated_read_time: String,
}

#[derive(Deserialize)]
struct ExplainRequest {
    paper_id: String,
    detail_level: Option<String>,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Understand any research paper".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(ApiResponse::<()> {
        success: true,
        data: None,
        error: None,
    })
}

async fn explain_paper(Json(req): Json<ExplainRequest>) -> impl IntoResponse {
    let explanation = PaperExplanation {
        title: "Understanding Transformer Architecture".to_string(),
        abstract_text: "This paper proposes a novel transformer architecture with improved attention mechanisms for natural language processing tasks, demonstrating significant performance gains on multiple benchmarks while reducing computational complexity.".to_string(),
        summary: "This paper introduces a new way to build AI models that understand language better. The key innovation is a smarter attention mechanism that helps the model focus on the most important parts of text while using less computing power.".to_string(),
        key_concepts: vec![
            "Self-attention mechanism".to_string(),
            "Multi-head attention".to_string(),
            "Positional encoding".to_string(),
            "Transformer blocks".to_string(),
        ],
        methodology: "The authors tested their approach on standard language tasks and compared results with existing models using established metrics.".to_string(),
        findings: vec![
            "30% faster training compared to baseline".to_string(),
            "5% better accuracy on language understanding tasks".to_string(),
            "Works well with limited training data".to_string(),
        ],
        difficulty_level: "Intermediate".to_string(),
        estimated_read_time: "15 minutes".to_string(),
    };

    Json(ApiResponse {
        success: true,
        data: Some(explanation),
        error: None,
    })
}

async fn simplify_text(Json req): Json<serde_json::Value> {
    let simplified = serde_json::json!({
        "original": req.get("text").and_then(|v| v.as_str()).unwrap_or(""),
        "simplified": "This complex text has been simplified to be more accessible to general readers.",
        "readability_score": 8.5
    });

    Json(ApiResponse {
        success: true,
        data: Some(simplified),
        error: None,
    })
}

async fn get_glossary() -> impl IntoResponse {
    let glossary = vec![
        serde_json::json!({ "term": "Attention Mechanism", "definition": "A technique that allows models to focus on relevant parts of input" }),
        serde_json::json!({ "term": "Transformer", "definition": "A neural network architecture based on self-attention" }),
        serde_json::json!({ "term": "Fine-tuning", "definition": "Adapting a pre-trained model to a specific task" }),
    ];

    Json(ApiResponse {
        success: true,
        data: Some(glossary),
        error: None,
    })
}

async fn get_stats() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({
            "papers_explained": 456789,
            "avg_readability_improvement": 67,
            "concepts_defined": 12345,
            "active_users": 89012
        })),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/explain", post(explain_paper))
        .route("/api/simplify", post(simplify_text))
        .route("/api/glossary", get(get_glossary))
        .route("/api/stats", get(get_stats))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Understand any research paper backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
