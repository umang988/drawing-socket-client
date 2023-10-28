import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit {
  // Reference to the HTML canvas element
  @ViewChild('myCanvas', { static: true }) myCanvas!: ElementRef;

  // Canvas drawing properties
  public canvas!: HTMLCanvasElement;
  public context: CanvasRenderingContext2D | null = null;
  public isDrawing: boolean = false;

  constructor(private socket: Socket) {}

  ngOnInit(): void {
    // Initialize the canvas and context
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");

    // Set up initial drawing properties
    if (this.context) {
      this.adjustCanvasSize();
      this.context.lineWidth = 2; // Line width
      this.context.strokeStyle = 'black'; // Line color
      this.context.lineCap = 'round'; // Line ends style
    }

    // Subscribe to drawing data from other clients
    this.socket.fromEvent('copy-draw').subscribe((data: any) => {
      if (data == 'stop') {
        // If 'stop' is received, start a new drawing path
        this.context?.beginPath();
      } else {
        // Continue drawing with the received coordinates
        this.context?.lineTo(data.x, data.y);
        this.context?.stroke();
      }
    });
  }

  // Adjust canvas size to match the viewport
  adjustCanvasSize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  // Handle mouse move event for drawing
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) {
      // Send a 'stop' signal to the server when not drawing
      this.socket.emit('draw', 'stop');
      return;
    }
    if (this.context) {
      // Continue drawing lines and emit the coordinates to the server
      this.context.lineTo(event.offsetX, event.offsetY);
      this.context.stroke();
      this.socket.emit('draw', {
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  // Handle mouse down event to start drawing
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.context?.beginPath();
    this.context?.moveTo(event.offsetX, event.offsetY);
  }

  // Handle mouse up event to stop drawing
  @HostListener('mouseup')
  onMouseUp(): void {
    this.isDrawing = false;
  }
}