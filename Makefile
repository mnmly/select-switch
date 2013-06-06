
build: components index.js select-switch.css
	@component build

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
