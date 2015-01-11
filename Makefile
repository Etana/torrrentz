.PHONY: update

extension.zip:	extension/t.js extension/manifest.json
	rm -f $@
	7z -mx=9 a $@ extension

extension/t.js: t.js
	closure --compilation_level ADVANCED_OPTIMIZATIONS --js t.js|tr \\n ' '|sed -r 's/((;[a-z]+|\))\.)((r)emove|(i)nsertBefore|(t)ext|(p)arent)\b/\1\4\5\6\7/g' > $@

extension/manifest.json:	manifest.json
	cat manifest.json | tr '\n' ' '|sed -r 's/([\{\},:\["]|\])\s+/\1/g' > $@

clean:
	rm -f extension{.zip,/{t.js,manifest.json}}
