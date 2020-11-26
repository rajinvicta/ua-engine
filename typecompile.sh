tsc --declaration --target es2015 --outDir js/types
dts-bundle --name UAE --main js/types/Game/UAE.d.ts
cp js/types/Game/UAE.d.ts dist/UAE.d.ts
rm -rf js/types
