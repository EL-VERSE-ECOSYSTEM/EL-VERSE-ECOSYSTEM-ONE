from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Supabase & DB
    supabase_url: str = "https://kipafxeitjrlqtdhzhse.supabase.co"
    supabase_service_role_key: str = "placeholder_key"
    database_url: str = "postgres://postgres:postgres@localhost:5432/postgres"

    # LLM Providers
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    huggingface_api_key: str | None = None

    # Default model per persona
    menato_model: str = "gpt-4o"
    spectre_model: str = "gpt-4o"
    nelly_model: str = "gpt-4o-mini"
    elly_model: str = "gpt-4o"

    # RAG
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # Service
    internal_api_key: str = "ai_internal_secret_key"
    log_level: str = "INFO"

settings = Settings()
