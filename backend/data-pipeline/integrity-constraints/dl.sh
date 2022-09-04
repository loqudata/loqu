#!/bin/bash

file=tmp.xml

# Unfortunately, this doesn't work when we omit show-body-only. But when we do, XPath doesn't have a root element to look for, so we create it.
echo '<body>' > $file
# See https://stackoverflow.com/questions/2491657/how-do-i-get-html-tidy-to-not-put-newline-before-closing-tags
curl https://www.w3.org/TR/vocab-data-cube/ | tidy -mqi --doctype omit --show-body-only true --show-warnings no --clean yes --asci-chars yes --vertical-space no --wrap 0 -asxml -gdoc >> $file
echo '</body>' >> $file

expr='//section[@id="wf-rules"]//td/pre/text()'

IFS='Z'
rawConstraints=$(xmlstarlet sel -t -m "$expr" -c "." -v "concat(text(),'$IFS')" -n $file)

i=1;
for section in $rawConstraints; do
    echo "Handling IC-$i"
    echo $section > IC-$i.rq
    i=$(expr $i + 1)
done

# The only remaining issue are the HTML entities in the last two, which one can convert by hand