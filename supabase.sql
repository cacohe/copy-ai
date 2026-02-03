-- 删除 users 表，直接使用 auth.users
-- DROP TABLE IF EXISTS users CASCADE;

----------------------------------
-- 用户档案表
----------------------------------
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS 策略（简化版）
CREATE POLICY "Users can manage own profiles"
ON user_profiles
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


----------------------------------
-- generated_contents 表，使用 UUID
----------------------------------
CREATE TABLE generated_contents (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    platform VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    keywords VARCHAR(500),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_generated_contents_user_created ON generated_contents(user_id, created_at DESC);
CREATE INDEX idx_generated_contents_platform ON generated_contents(platform);

-- 启用 RLS
ALTER TABLE generated_contents ENABLE ROW LEVEL SECURITY;

-- RLS 策略（简化版）
CREATE POLICY "Users can manage own content"
ON generated_contents
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);