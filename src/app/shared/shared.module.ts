import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { HttpClientModule }       from '@angular/common/http';

import { SwingSelectComponent }    from './swing-select/swing-select.component';
import { SwingSwitchComponent }    from './swing-switch/swing-switch.component';
import { IdenticonHashDirective }  from './identicon-hash.directive';
import { SwingCalendarComponent }  from './swing-calendar/swing-calendar.component';
import { SwingTagInputComponent }  from './swing-tag-input/swing-tag-input.component';
import { TabComponent } from './tab/tab.component';
import { SafeHtmlPipe } from '../shared/pipes/sanitizeHtmlPipe.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [
    IdenticonHashDirective,
    SwingSwitchComponent,
    SwingSelectComponent,
    SwingCalendarComponent,
    SwingTagInputComponent,
    TabComponent,
    SafeHtmlPipe
  ],
  exports:      [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IdenticonHashDirective,
    SwingCalendarComponent,
    SwingSelectComponent,
    SwingSwitchComponent,
    SwingTagInputComponent,
    TabComponent,
    SafeHtmlPipe
  ],
  providers:    [  ],
})
export class SharedModule { }
