import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MonacoEditorService } from '../monaco-editor.service';
import { first } from 'rxjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs'


declare var monaco:any;

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})
export class MonacoEditorComponent implements  AfterViewInit {
  public _editor:any;
  @ViewChild('editorContainer', {static:true}) _editorContainer:ElementRef | undefined;


  

  constructor( private monacoEditorService:MonacoEditorService){}

  private initMonaco(): void {
    if(!this.monacoEditorService.loaded) {
      this.monacoEditorService.load()
      this.monacoEditorService.loadingFinished.pipe(first()).subscribe(() => {
        
        this.initMonaco();


        const ydoc = new Y.Doc()
        const provider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc)
        const yText = ydoc.getText('monaco')
    
        // Bind Yjs to the Monaco editor
        const monacoBinding = new MonacoBinding(yText, this._editor.getModel(), new Set([this._editor]), provider.awareness)
    
      });
      return;
    }

    this._editor = monaco.editor.create(
      this._editorContainer!.nativeElement,
      {
        theme: 'vs-dark',
        language: 'html',
        roundedSelection: true,
        autoIndent: 'full'
      }
      
    );
  }

  ngOnInit() {
    this.initMonaco();
  }

  ngAfterViewInit(): void {
  }

}
