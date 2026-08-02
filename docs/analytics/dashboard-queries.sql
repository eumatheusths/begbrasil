-- Consultas para Dashboard Metabase/Grafana/Redash

-- 1. Orçamentos Recebidos por Status
SELECT status, COUNT(*) AS total
FROM quotes
GROUP BY status
ORDER BY total DESC;

-- 2. Produtos/Categorias mais Solicitados
SELECT category, COUNT(*) AS total
FROM quotes
GROUP BY category
ORDER BY total DESC;

-- 3. Origem dos Leads (UTM Source / Campaign)
SELECT 
    COALESCE(u.utm_source, 'Direto/Orgânico') AS origem, 
    COUNT(q.id) AS leads
FROM quotes q
LEFT JOIN utm_data u ON q.id = u.quote_id
GROUP BY 1
ORDER BY leads DESC;

-- 4. Funil e Tempos (Criado -> Revisado -> Cotado)
SELECT 
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) AS tempo_medio_resposta_horas
FROM quotes
WHERE status != 'RECEIVED';

-- 5. Leads por Estado (Geografia do Contato)
SELECT 
    c.state, 
    COUNT(q.id) AS total_leads
FROM quotes q
JOIN contacts c ON q.contact_id = c.id
GROUP BY c.state
ORDER BY total_leads DESC;
