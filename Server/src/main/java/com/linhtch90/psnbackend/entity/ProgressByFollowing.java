package com.linhtch90.psnbackend.entity;

public class ProgressByFollowing {
    private UserEntity user;
    private ProgressEntity progress;

    public ProgressByFollowing() {
    }

    public ProgressByFollowing(UserEntity user, ProgressEntity progress) {
        this.user = user;
        this.progress = progress;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public ProgressEntity getProgress() {
        return progress;
    }

    public void setProgress(ProgressEntity progress) {
        this.progress = progress;
    }
}