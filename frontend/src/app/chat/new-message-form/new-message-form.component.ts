import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ChatImageData } from "../message.model";
import { FileReaderService } from "../filereader.service";

@Component({
  selector: "app-new-message-form",
  templateUrl: "./new-message-form.component.html",
  styleUrls: ["./new-message-form.component.css"],
})
export class NewMessageFormComponent {
  messageForm = this.fb.group({
    msg: "",
  });

  @Output()
  newMessage = new EventEmitter<{
    text: string;
    imageData: ChatImageData | null;
  }>();

  constructor(
    private fb: FormBuilder,
    private fileReaderService: FileReaderService
  ) {}

  file: File | null = null;

  async onSendMessage() {
    if (this.messageForm.valid && this.messageForm.value.msg) {
      let imageData: ChatImageData | null = null;
      if (this.file) {
        imageData = await this.fileReaderService.readFile(this.file);
      }
      this.newMessage.emit({ text: this.messageForm.value.msg, imageData });
      this.messageForm.reset();
      this.file = null;
    }
  }

  fileChanged(event: any) {
    this.file = event.target.files[0];
  }
}
