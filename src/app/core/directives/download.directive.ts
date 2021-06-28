import {
	Directive,
	Renderer2,
	Inject,
	AfterViewInit,
	ElementRef,
	HostListener,
	Output,
	EventEmitter,
	ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[upload-btn]',
})
export class UploadButtonDirective implements AfterViewInit {
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private _ref: ChangeDetectorRef
	) {}

	@HostListener('click')
	trigger(): void {
		(this.elementRef.nativeElement.children[0] as HTMLInputElement).click();
	}

	@Output('handleFile') token = new EventEmitter<File>();

	ngAfterViewInit(): void {
		const obj: HTMLInputElement = this.document.createElement('input');
		obj.setAttribute('type', 'file');
		obj.style.display = 'none';
		obj.onchange = (_) => this.token.emit(obj.files.item(0));
		this.renderer.appendChild(this.elementRef.nativeElement, obj);
	}
}
