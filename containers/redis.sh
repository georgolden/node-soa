sudo docker run -v $(pwd)/containers/redis.conf:/usr/local/etc/redis -p 6379:6379 -d --name redis-dev redis redis-server /usr/local/etc/redis
