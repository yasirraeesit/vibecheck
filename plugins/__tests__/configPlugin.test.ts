import { modifyAppBuildGradle } from '../withSmartSpectra';

describe('withSmartSpectra Config Plugin', () => {
  it('injects SmartSpectra maven dependency into build.gradle dependencies block', () => {
    const originalGradle = `
dependencies {
    implementation("com.facebook.react:react-android")
}
`;
    const modified = modifyAppBuildGradle(originalGradle);
    expect(modified).toContain('com.presagetech:smartspectra:1.0.25');
    expect(modified).toContain('implementation("com.presagetech:smartspectra:1.0.25")');
  });

  it('does not duplicate dependency if already present', () => {
    const existing = `
dependencies {
    implementation("com.presagetech:smartspectra:1.0.25")
}
`;
    const modified = modifyAppBuildGradle(existing);
    const matches = modified.match(/com\.presagetech:smartspectra/g);
    expect(matches?.length).toBe(1);
  });
});
