-- くぼちゃんパン公式サイト 注文保存テーブル
-- Supabase SQL Editorで実行してください。

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  order_data jsonb not null,
  status text default '銀行振込待ち',
  total integer default 0,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

-- 公開サイトから注文作成だけ許可します。
drop policy if exists "public can insert orders" on public.orders;
create policy "public can insert orders"
on public.orders
for insert
to anon
with check (true);

-- 読み取りポリシーは作りません。
-- 管理者閲覧は、後でSupabase Auth導入後に authenticated 管理者専用ポリシーを追加してください。
