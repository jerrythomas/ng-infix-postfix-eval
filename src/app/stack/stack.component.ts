import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss']
})
export class StackComponent implements OnInit {
  data : any[] = [];
  _minSize: number = 5;

  @Input()
  set minSize(size: number){
    this._minSize = size;
  }

  get emptySize(){
    return this._minSize > this.data.length ? this._minSize - this.data.length: 0;
  }
  
  constructor() {}

  ngOnInit() {}

  
  public push(value: any){
    this.data.push(value)
  }

  public pop(): any{
    return this.data.pop()
  }
}