INSERT INTO public.applications (slug, name, description, icon, url, is_active, is_coming_soon, display_order)
VALUES 
  ('quant-matrix', 'Quant Matrix', 'Algorithmic Arbitrage Screener & Cointegration Engine', 'ShieldCheck', 'http://localhost:3003', true, false, 4)
ON CONFLICT (slug) DO UPDATE 
SET url = EXCLUDED.url, is_active = EXCLUDED.is_active;