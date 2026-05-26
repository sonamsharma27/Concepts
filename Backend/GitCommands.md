# Stashing changes
git stash
git stash --staged
git stash pop
git stash save <stash_name>
git stash list
git stash apply <stash_name>
-------------------------------

# Commit history
git log 
git log --oneline --graph --decorate

-------------------------------------------------

# Modifying the last commit mesage 

git commit --amend -m <new_msg>

# Adding files to last commit without a new commit

git add <files_to_be_added>

git commit -amend --no-edit // with same commit message 
git commit --amend -m <new_msg> // with new message

Works if commit is not yet pushed

-------------------------------------------------

# Revert commit

git revert <commit_hash>

-------------------------------------------------

# Branch rename

git branch -M <new_name>

-------------------------------------------------

# Git bisect

git bisect start
git bisect bad
git bisect good <last_working_commit>

Depending on the bisected commit, type
git bisect good -> if it is working as expected
git bisect bad -> if not

-------------------------------------------------

# Going back 5 commits
git checkout HEAD~5

-------------------------------------------------

# Checking who made changes to file

git blame filename.ext
git blame -L 15,30 filename.ext

-------------------------------------------------

# To view the full commit message and the exact code changes (diff) for a specific commit hash

git show <commit_hash>