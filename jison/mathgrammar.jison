
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b    return 'NUMBER'
"*"                     return '*'
"/"                     return '/'
"-"                     return '-'
"+"                     return '+'
","                     return ','
"^"                     return '^'
"("                     return '('
")"                     return ')'
"="                     return '='
":"                     return ':'
"@"                     return '@'
[a-zA-Z]+               return 'WORD'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start equation

%% /* language grammar */

equation
    : expression '=' expression EOF
        { return new EquationNode($1, $3); }
    | function_dec '=' expression EOF
        { console.log($1, $2, $3, $4);
          functionTable.registerFunction($1, $3);
          return new EquationNode($1, $3);
        }
    ;

function_dec : '@' WORD '(' var_list ')'
                  {$$ = new FunctionNode($WORD, $4, true);}
            ;
            
var_list : var_list ',' variable
             {$1.push($3); $$=$1;}
         | variable
             {$$ = [$1];}
         ;
        
expression : expression '+' factor
                {$$ = new OpNode($2, $1, $3);}
          | expression '-' factor
                {$$ = new OpNode($2, $1, $3);}
          | factor
                {$$ = $1;}
          ;

factor : factor '*' term
            {$$ = new OpNode($2, $1, $3);}
       | factor '/' term
            {$$ = new OpNode($2, $1, $3);}
       | term
            {$$ = $1;}
       ;
       
term : exponent
            {$$ = $1;}
     | value
            {$$ = $1;}
     ;
     
exponent: value '^' value
                {$$ = new OpNode($2, $1, $3);}
        ;

value : parens
            {$$ = $1;}
      | NUMBER
            {$$ = new NumberNode(Number(yytext));}
      | '-' NUMBER
            {$$ = new NumberNode(-1*Number(yytext));}
      | function
            {$$ = $1;}
      | variable
            {$$ = $1;}
      ;
      
parens : '(' expression ')'
            {$$ = new ParensNode($2);}
       ;

function : WORD '(' params ')'
                {$$ = new FunctionNode($WORD, $3, false);}
         ;

params : params ',' expression
                {$1.push($3); $$=$1;}
       | expression
                {$$ = [$1];}
       ;
       
variable : WORD
        {$$ = new VarNode(yytext);};

