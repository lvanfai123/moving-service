-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Partners policies
CREATE POLICY "Public can view active partners" ON partners
    FOR SELECT USING (status = 'active');

CREATE POLICY "Partners can view own profile" ON partners
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update own profile" ON partners
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all partners" ON partners
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Quote requests policies
CREATE POLICY "Users can view own quote requests" ON quote_requests
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create quote requests" ON quote_requests
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partners can view assigned quote requests" ON quote_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM notifications
            WHERE notifications.quote_request_id = quote_requests.id
            AND notifications.partner_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all quote requests" ON quote_requests
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Quotes policies
CREATE POLICY "Users can view quotes for their requests" ON quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quote_requests
            WHERE quote_requests.id = quotes.quote_request_id
            AND quote_requests.user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can create quotes" ON quotes
    FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can view own quotes" ON quotes
    FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Partners can update own quotes" ON quotes
    FOR UPDATE USING (partner_id = auth.uid());

CREATE POLICY "Service role can manage all quotes" ON quotes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners can view assigned orders" ON orders
    FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Service role can manage all orders" ON orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all payments" ON payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Reviews policies
CREATE POLICY "Public can view published reviews" ON reviews
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create reviews for completed orders" ON reviews
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = reviews.order_id
            AND orders.user_id = auth.uid()
            AND orders.status = 'completed'
        )
    );

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all reviews" ON reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Referral policies
CREATE POLICY "Users can view own referral code" ON referral_codes
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own referral relationships" ON referral_relationships
    FOR SELECT USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can view own referral rewards" ON referral_rewards
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all referral data" ON referral_codes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all referral relationships" ON referral_relationships
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all referral rewards" ON referral_rewards
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Notifications policies
CREATE POLICY "Partners can view own notifications" ON notifications
    FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Service role can manage all notifications" ON notifications
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role'); 