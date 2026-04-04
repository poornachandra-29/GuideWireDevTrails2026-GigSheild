import redis
from config.settings import settings

# Setup pure python dictionary fallback for redis to guarantee execution without docker
class DummyRedis:
    def __init__(self):
        self.data = {}
    def setex(self, name, time, value):
        self.data[name] = value
        return True
    def get(self, name):
        return self.data.get(name)
    def delete(self, name, *args):
        if name in self.data:
            del self.data[name]
        return 1

# Global client
redis_client = None

try:
    import redis
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
    redis_client.ping()
    print("!!! Connected to real Redis")
except:
    redis_client = DummyRedis()
    print("!!! Using DummyRedis fallback")
