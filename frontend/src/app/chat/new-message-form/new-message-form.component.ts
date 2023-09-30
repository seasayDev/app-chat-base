import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Message } from "../message.model";

@Component({
  selector: "app-new-message-form",
  templateUrl: "./new-message-form.component.html",
  styleUrls: ["./new-message-form.component.css"],
})
export class NewMessageFormComponent implements OnInit {
  @Input() username: string | null = null;
  @Output() newMessage = new EventEmitter<Message>();

  messageForm = this.fb.group({
    msg: "",
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onPublishMessage() {
    if (this.username && this.messageForm.valid && this.messageForm.value.msg) {
      this.newMessage.emit({
        text: this.messageForm.value.msg,
        username: this.username,
        timestamp: Date.now(),
      });
      // Réinitialisation du formulaire
      this.messageForm.reset();
    }
  }
}
