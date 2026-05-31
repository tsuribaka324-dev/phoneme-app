-- Supabase上で実行するSQL
-- Dashboard → SQL Editor に貼り付けて Run してください

-- ユーザーごとの音素スコアを保存するテーブル
create table if not exists phoneme_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  sym         text not null,           -- e.g. "/æ/"
  attempts    integer default 0,
  correct     integer default 0,
  updated_at  timestamptz default now(),
  unique (user_id, sym)
);

-- Row Level Security
alter table phoneme_scores enable row level security;

create policy "Users can read own scores"
  on phoneme_scores for select
  using (auth.uid() = user_id);

create policy "Users can upsert own scores"
  on phoneme_scores for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scores"
  on phoneme_scores for update
  using (auth.uid() = user_id);
