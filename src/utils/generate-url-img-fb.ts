export function generateUrlImgFb(fbObjectId: string, accessToken: string): string {
    return `https://graph.facebook.com/${fbObjectId}/picture?type=small&access_token=${accessToken}`;
}
