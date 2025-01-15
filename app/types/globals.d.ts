export { publicMetadata }

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            onboardingComplete?: boolean
        }
    }
}