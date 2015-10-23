To generate a parser:
    - First, you need to install node.js, and the node package manager, npm.
      link: https://nodejs.org/en/download/ (npm comes with it)
    
    - Second, run "npm install jison -g"
    
    - After npm has successfully installed jison, 
      run "jison mygrammar.jison -o parser.js -m js"
      (Explanations of these option flags can be found by running jison -help)
      
    - A new file will appear in the current working directory called parser.js.

To use a generated parser:
    - Include this js file in your web page.
    
    - run var myTree = parser.parse('your string to be parsed here');
    
For algebreezy, we need to serve parser.js from our own server as a static file.
On each page, include <script src='path/to/parser.js'></script>
    
The end!
For more documentation on Jison usage, see http://zaach.github.io/jison/docs/
    