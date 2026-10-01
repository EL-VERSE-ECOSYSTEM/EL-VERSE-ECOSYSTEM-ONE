-- tests/rls_courses_test.sql
BEGIN;

-- Setup mock profiles and courses
INSERT INTO profiles (id, user_id, full_name, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Tutor User', 'tutor'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Learner User', 'learner');

INSERT INTO courses (id, title, tutor_id, status, price)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Published Go Masterclass', '11111111-1111-1111-1111-111111111111', 'published', 99.99),
  ('44444444-4444-4444-4444-444444444444', 'Draft Rust Course', '11111111-1111-1111-1111-111111111111', 'draft', 49.99);

-- Test queries
SELECT id, title, status FROM courses WHERE status = 'published';

ROLLBACK;
