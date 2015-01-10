.PHONY: update

update:	torrrentz.min.js	

%.zip:	torrrentz.min.js
		rm -f $@
		cat manifest.json | grep -Po '(?<=")[[:alpha:]][[:alnum:]]*(\.[[:alnum:]]+)+(?=")' | xargs 7z -mx=9 a $@ manifest.json

torrrentz.min.js: torrrentz.js
		closure --compilation_level ADVANCED_OPTIMIZATIONS --js torrrentz.js > torrrentz.min.js
		
				
