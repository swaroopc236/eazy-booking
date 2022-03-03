import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSelectRoom]'
})
export class SelectRoomDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { 
    console.log(el.nativeElement.options);
  }

  setRoom(roomId: string) {
    console.log('inside directive func', roomId);
    this.el.nativeElement.value = roomId;
    // this.renderer.setAttribute(this.el.nativeElement, 'value', roomId);
    // console.log(this.el.nativeElement.value);

    // this.renderer.setProperty(this.el.nativeElement.options, 'selectedIndex', '4');

    try {
      // console.log(el.options[2]);
      for (var i = 0; i < this.el.nativeElement.options.length; i++) {
        console.log('current id', this.el.nativeElement.options[i].value);
        if (this.el.nativeElement.options[i].value === roomId) {
          console.log('matched value');
          this.el.nativeElement.options[i].selected = true;
          this.el.nativeElement.selectedIndex = i;
          break;
        }
      }
    } catch (e) {
      console.log('Exception occured', e);
    }
  }

}
