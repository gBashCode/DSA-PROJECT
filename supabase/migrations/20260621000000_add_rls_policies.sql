-- RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON user_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for session_history
CREATE POLICY "Users can view own sessions" ON session_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON session_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON session_history FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for interview_sessions
CREATE POLICY "Users can view own interviews" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for srs_data
CREATE POLICY "Users can view own srs" ON srs_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own srs" ON srs_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own srs" ON srs_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own srs" ON srs_data FOR DELETE USING (auth.uid() = user_id);
