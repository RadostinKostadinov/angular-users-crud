import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent {
  @Input() id?: string;
  isOpen = false;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    this.modalService.add(this);

    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'custom-modal') {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.element.remove();
    this.modalService.remove(this);
  }

  open() {
    this.element.style.display = 'block';
    document.body.classList.add('custom-modal-open');
    this.isOpen = true;
  }

  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('custom-modal-open');
    this.isOpen = false;
  }
}
