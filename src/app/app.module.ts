import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { StackComponent } from './stack/stack.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfixComponent } from './infix/infix.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule  , ReactiveFormsModule],
  declarations: [ AppComponent, HelloComponent, StackComponent, InfixComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
