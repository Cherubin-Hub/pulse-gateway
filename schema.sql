-- 1. Applications Registry Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Activity',
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_coming_soon BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Initial Seed for Trading Apps
INSERT INTO public.applications (slug, name, description, icon, url, is_active, is_coming_soon, display_order)
VALUES 
  ('forex-pulse', 'Forex Pulse', 'Institutional Risk Engine, High-Impact News Gatekeeper, Multi-Timeframe Screeners & Execution Post-Mortem.', 'Activity', 'http://localhost:3001', true, false, 1),
  ('crypto-radar', 'Crypto Radar', 'Order Book Imbalance, Funding Rates, Liquidation Heatmaps, and High-Velocity Volatility Tracking.', 'Flame', '', false, true, 2),
  ('execution-journal', 'Execution Journal', 'Psychology Edge Tracker, Rule Adherence Auditing, and Automated Trade Post-Mortems.', 'BookOpen', '', false, true, 3)
ON CONFLICT (slug) DO NOTHING;