# Kalvium Git / PR Workflow

Use a separate branch for each LU, then commit, push, create a PR, request the specified AI review, record the required video, and merge the PR.

Example branch names:
- `lu-2-1-github-setup`
- `lu-2-2-react-init`
- `lu-2-3-react-components`
- `lu-2-4-mongoose-schema`
- `lu-2-5-db-operations`
- `lu-2-6-get-api`
- `lu-2-7-post-api`
- `lu-2-8-put-api`
- `lu-2-9-update-delete`
- `lu-2-10-relationships`
- `lu-2-11-auth`
- `lu-2-12-jwt`

Typical commands:

```bash
git checkout -b lu-2-x-feature
git add .
git commit -m "Implement LU 2.x"
git push -u origin lu-2-x-feature
```

After creating the PR, use the exact Kalvium instruction:

`@CodiumAI-Agent /review`

Merge the PR after the required review/submission process. Keep the main branch named `main`.
