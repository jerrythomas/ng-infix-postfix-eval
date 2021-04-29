import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Subject, timer, Observable } from 'rxjs';
import { Token } from '../../token';

@Component({
  selector: 'app-infix',
  templateUrl: './infix.component.html',
  styleUrls: ['./infix.component.scss']
})
export class InfixComponent implements OnInit {
  expr = new FormControl('');
  valid : boolean = true;
  tokens: string[];
  reasons: string[] = [];
  
  @Output() tokenStream: EventEmitter<Token> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  // Validate the following are false
  // (), +, (, ) 1 + 2, (1+2, 1++, -1  
  // The foll should be true
  // (1+2), 1 + 1 ^ -1, 
  validate(tokens): boolean {
    var bracket = 0;
    var operators = 0;
    var operands = 0;
    var isValid = true;
    this.reasons = [];

    tokens.forEach(token => {
       if (['*', '^', '+', '-', '/'].indexOf(token) < 0) {
          if (token === '('){
            bracket++;
          }
          else if (token == ')'){
            bracket--;
            isValid = isValid && (bracket >= 0)
          }
          else {
            operands++;
            isValid = isValid && !isNaN(token)
          }
       } 
       else
         operators++
       //console.log(token, isValid, bracket)
    })
    if (!isValid)
      this.reasons.push("Did you forget the opening bracket(s)?");
    
    isValid = isValid && (bracket == 0) && (operators == operands - 1) && (operators > 0)
    if (!isValid){
      if (bracket != 0)
        this.reasons.push("Did you forget to match the brackets?");
      if (operators < operands -1)
        this.reasons.push("Did you forget some operators?");
      if (operators > operands -1)
        this.reasons.push("Did you forget some values?");
    }
    return isValid
  }

  clean(expr: string):string {
    return expr.replace(/(\*|\+|\-|\/|\(|\)|\^)/g, " $1 ").trim().replace(/\s+/g, ' ');
  }

  tokenize(expr: string): string[] {
    var operators: string[] = ['*', '^', '+', '-', '/' , '('];
    //var equation = expr.replace(/(\*|\+|\-|\/|\(|\)|\^)/g, " $1 ").trim()
    var items = expr.split(/\s+/);
    var tokens = [];

    // Handle negative negative numbers in expression
    var previous = '(';
    var token = '';
    var i = 0;
    while (i < items.length){
      token = items[i];
      if (token === '-'){
        if (operators.indexOf(previous) > -1){
           token = '-' + items[i+1]
           i++
        }
      } 
      previous = token
      tokens.push(token);
      i++;
    } 
    return tokens
  }

  streamTokens(){
    var tokenTimerSub: Subscription;
    tokenTimerSub = timer(0, 1000).subscribe((tick) => {
        console.log(tick, this.tokens[tick]);
        if (tick < this.tokens.length)
          this.tokenStream.emit({text:this.tokens[tick], index: tick})
        else {
          this.tokenStream.emit({text:undefined, index: -1})
          tokenTimerSub.unsubscribe()
      }
    })
  }
  // tokenize
  // 1 + 1 ^ -1 * -1 => ["1", "+", "1", "^", "-1", "*", "-1"]
  evaluate() { 
    console.log(this.expr.value, this.clean(this.expr.value))
    this.expr.setValue(this.clean(this.expr.value)) 
    this.tokens = this.tokenize(this.expr.value)
    this.valid = this.validate(this.tokens);
    
    if (this.valid)
      this.streamTokens()
  }

  

}