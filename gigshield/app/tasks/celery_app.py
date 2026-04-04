from celery import Celery
from config.settings import settings

# If Redis isn't running on the laptop, fallback to SQLAlchemy sync execution for dev
# This is a defensive override given the user's constraints about environment!
celery_app = Celery("Seguro Partner")

try:
    import redis
    r = redis.Redis.from_url(settings.redis_url)
    r.ping()
    celery_app.conf.update(
        broker_url=settings.redis_url,
        result_backend=settings.redis_url,
        task_serializer='json',
        accept_content=['json'],
    )
except Exception:
    # Disable celery queue, run tasks synchronously if missing Redis!
    celery_app.conf.update(
        task_always_eager=True,
    )
