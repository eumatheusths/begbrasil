CREATE TABLE utm_data (
    id UUID PRIMARY KEY,
    quote_id UUID NOT NULL,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    CONSTRAINT fk_utm_quote FOREIGN KEY (quote_id) REFERENCES quotes (id) ON DELETE CASCADE
);

CREATE INDEX idx_utm_source ON utm_data(utm_source);
CREATE INDEX idx_utm_campaign ON utm_data(utm_campaign);
