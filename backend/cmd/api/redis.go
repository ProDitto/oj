package main

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisService struct {
	client *redis.Client
}

func NewRedisService(addr string) *RedisService {
	rdb := redis.NewClient(&redis.Options{
		Addr: addr,
	})

	return &RedisService{client: rdb}
}

func (r *RedisService) Close() {
	r.client.Close()
}

func (r *RedisService) StartResultWorker(
	ctx context.Context, handleResultFunc func(*ExecutionResponse), wg *sync.WaitGroup,
) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		// log.Println("🛠️ Result worker started...")
		for {
			select {
			case <-ctx.Done():
				// log.Println("🛑 Result worker shutting down...")
				return
			default:
				res, err := r.client.BLPop(ctx, 5*time.Second, "results_queue").Result()
				if err != nil {
					if err == redis.Nil {
						continue // no result yet
					}
					if ctx.Err() != nil {
						// log.Println("Context canceled, exiting worker...")
						return
					}
					// log.Printf("Redis BLPOP error: %v", err)
					time.Sleep(1 * time.Second)
					continue
				}

				var result ExecutionResponse
				if err := json.Unmarshal([]byte(res[1]), &result); err != nil {
					// log.Printf("Invalid result JSON: %v", err)
					continue
				}

				handleResultFunc(&result)
			}
		}
	}()
}

func (r *RedisService) ExecuteCode(ctx context.Context, payload ExecutionPayload) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	return r.client.RPush(ctx, string(payload.Language), data).Err()
}

// Set caches a key-value pair with an optional expiration time.
func (r *RedisService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return r.client.Set(ctx, key, data, expiration).Err()
}

// Get retrieves a value from the cache and unmarshals it into the provided destination.
func (r *RedisService) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := r.client.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// Delete removes a key from the Redis cache.
func (r *RedisService) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, key).Err()
}
