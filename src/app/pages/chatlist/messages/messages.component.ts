import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInbox, Inbox } from 'src/app/models/inbox.model';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { InboxService } from 'src/app/services/inbox.service';
import { IMessages, GMessages } from 'src/app/shared/interfaces';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('view', { static: true }) private view: any;

  user: IUser = {} as IUser;
  currentInbox: Inbox = {} as IInbox;
  sender: IUser = {} as IUser;
  messages: IMessages = {};
  contactIdDetails: any = {};
  getContactDetails: any = ''
  enableMemberList: boolean = false;
  enableAddNewMember: boolean = false;
  groupMessages: GMessages = {};
  userId: any = 'BCQPUuYMicVB0RzfL9ycIpjzNpD2';
  contactList: any = [];
  addContactList: any = [];
  searchContactList = '';
  selectMembersList: any = [];
  currentAlphabet: string = '';
  paramId: any = '';

  private subs = new SubSink();

  constructor(
    private chat: ChatService,
    private inbox: InboxService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.paramId = params.get('id');
      this.getContactDetails = sessionStorage.getItem("contactDetails");
      this.contactIdDetails = JSON.parse(this.getContactDetails).find((obj: any) => obj.objectId == this.paramId);

      console.log(this.contactIdDetails, '..this.contactIdDetails..');
      this.inbox.setCurrent(this.paramId);
    });

    this.subs.sink = this.auth.getUser((user: IUser) => {
      if (!user) {
        return;
      }

      this.user = user;
    });

    this.subs.sink = this.inbox.getCurrent((inbox: IInbox) => {
      if (!inbox) {
        return;
      }
      this.chat.fetchAll(inbox);
      this.chat.subscribe(inbox);
      this.currentInbox = inbox;
      this.sender = inbox.sender as IUser;
    });

    this.subs.sink = this.chat.getMessages((messages: IMessages) => {
      if (!messages) {
        return;
      }

      this.messages = messages;
      console.log(this.messages, '..this.messages.');
    });


    this.groupMessages = {
      '14/07/2021':[{
        objectId: '1',
        senderId: '5Lzl4TeyL2b70bbBiIWwgwhG0qz1',
        senderName: 'Albert Son',
        message: 'Hellow',
        groupMessage: true,
        createdAt: '2021-07-15T05:35:17.205Z'
      },
      {
        objectId: '2',
        senderId: 'BCQPUuYMicVB0RzfL9ycIpjzNpD2',
        senderName: 'Abois Abois',
        receiverId: '2',
        message: 'Hi',
        groupMessage: true,
        createdAt: '2021-07-15T05:45:17.205Z'
      },
      {
        objectId: '3',
        senderId: '5Lzl4TeyL2b70bbBiIWwgwhG0qz1',
        senderName: 'Albert Son',
        receiverId: '2',
        message: 'How are you. What are you doing now.',
        groupMessage: true,
        createdAt: '2021-07-15T05:55:17.205Z'
      }]
    };
    this.getContacts();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.view.nativeElement.scrollTop = this.view.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(message: string) {
    if (this.contactIdDetails.sender.groupname === undefined || this.contactIdDetails.sender.groupname === "") {
      this.chat.sendMessage(message, this.currentInbox, this.user);
    } else {
      let today = new Date();
      let dd: any = today.getDate();
      let mm: any = today.getMonth() + 1;
      let yyyy: any = today.getFullYear();
      if (dd < 10) {
          dd = '0' + dd;
      }
      if (mm < 10) {
          mm = '0' + mm;
      }
      let todayFormate: any = dd + '/' + mm + '/' + yyyy;
      if (this.groupMessages[todayFormate] == undefined) {
        this.groupMessages[todayFormate] = [];
      }
      this.groupMessages[todayFormate].push({
        objectId: '2',
        senderId: 'BCQPUuYMicVB0RzfL9ycIpjzNpD2',
        senderName: 'Abois Abois',
        receiverId: '2',
        message: message,
        createdAt: new Date()
      });
    }
    this.scrollToBottom();
  }

  openMemberList() {
    this.enableMemberList = true;
  }

  closeMemberList() {
    this.enableMemberList = false;
  }
  
  removeMember(member: any, index: number) {
    this.contactIdDetails.sender.groupmembers.splice(index, 1);
    this.updateSessionStorage();
  }

  dismissAdmin(member: any, index: number) {
    this.contactIdDetails.sender.groupmembers[index].admin = false;
    this.updateSessionStorage();
  }

  makeAdmin(member: any, index: number) {
    this.contactIdDetails.sender.groupmembers[index].admin = true;
    this.updateSessionStorage();
  }

  updateSessionStorage () {
    let setContactDetails = JSON.parse(this.getContactDetails).map((obj: any) => {
      if(obj.objectId == this.paramId) {
        obj.sender.groupmembers = this.contactIdDetails.sender.groupmembers;
      }
      return obj;
    });
    sessionStorage.setItem("contactDetails", JSON.stringify(setContactDetails));
  }

  addNewMemberOpen() {
    this.enableAddNewMember = true;
  }

  addNewMemberClose() {
    this.enableAddNewMember = false;
  }

  addNewMember() {
    this.selectMembersList.map((obj: any) => {
      this.contactIdDetails.sender.groupmembers.push(obj)
    });
    let setContactDetails = JSON.parse(this.getContactDetails).map((obj: any) => {
      if(obj.objectId == this.paramId) {
        obj.sender.groupmembers = this.contactIdDetails.sender.groupmembers;
      }
      return obj;
    });
    sessionStorage.setItem("contactDetails", JSON.stringify(setContactDetails));
    this.enableAddNewMember = false;
    this.enableMemberList = true;
  }

  getContacts() {
     const users = [{"key":"BCQPUuYMicVB0RzfL9ycIpjzNpD2","chatList":{"-Mc_3DmFRS_YrqItwf98":{"chatKey":"BCQPUuYMicVB0RzfL9ycIpjzNpD2_Xghd3wKQ9bZEPpACkEMP4LcnCzo2","lastUpdatedOn":1624119503074,"users":["BCQPUuYMicVB0RzfL9ycIpjzNpD2","Xghd3wKQ9bZEPpACkEMP4LcnCzo2"]}},"dateCreated":"2021-04-05T13:45:31.875Z","email":"abois@yopmail.com","firstName":"abois","lastName":"abois","status":"logedOut","timeStampWhenActive":1619435723506,"timestampCreated":1617630331875,"uid":"BCQPUuYMicVB0RzfL9ycIpjzNpD2"},{"key":"5Lzl4TeyL2b70bbBiIWwgwhG0qz1","chatList":{"-Mb7YCBqTnsnKmBSD-wp":{"chatKey":"5Lzl4TeyL2b70bbBiIWwgwhG0qz1_5uIrFLtfUrQmCM9KrTeRXQqzADu1","lastUpdatedOn":1622567245939,"users":["5Lzl4TeyL2b70bbBiIWwgwhG0qz1","5uIrFLtfUrQmCM9KrTeRXQqzADu1"]}},"dateCreated":"2021-03-17T14:33:59.453Z","email":"albert@yopmail.com","firstName":"albert","lastName":"son","status":"logedOut","timeStampWhenActive":1616148449402,"timestampCreated":1615991639453,"uid":"5Lzl4TeyL2b70bbBiIWwgwhG0qz1"},{"key":"3rRq5u39P3cpaPqJKd53IvX23To1","dateCreated":"2021-03-25T06:14:01.707Z","email":"deo@yopmail.com","firstName":"deo","lastName":"deo","status":"logedOut","timeStampWhenActive":1616653064801,"timestampCreated":1616652841707,"uid":"3rRq5u39P3cpaPqJKd53IvX23To1"},{"key":"gnAxVK2p01ZajTvQmwpQANCKUi53","dateCreated":"2021-04-09T06:33:47.694Z","email":"grouptest@yopmail.com","firstName":"group","lastName":"test","profilePicData":{"name":"download.png","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FgnAxVK2p01ZajTvQmwpQANCKUi53%2Fdownload.png?alt=media&token=3c6eb73b-6035-4bd2-9a34-1bba4c1265ae"},"status":"online","timeStampWhenActive":1619536761681,"timestampCreated":1617950027694,"uid":"gnAxVK2p01ZajTvQmwpQANCKUi53"},{"key":"b5VoQMcuyjev43IIe2joITF77gI2","dateCreated":"2021-03-18T17:33:27.763Z","email":"superorg1991@yopmail.com","firstName":"jacorie","lastName":"dockery","status":"away","timeStampWhenActive":1616133147513,"timestampCreated":1616088807763,"uid":"b5VoQMcuyjev43IIe2joITF77gI2"},{"key":"hBTKSBNWcubLDB5MxmRrGizWrcw2","dateCreated":"2021-03-19T10:12:57.117Z","email":"john2@yop.com","firstName":"john","lastName":"deo2","status":"logedOut","timeStampWhenActive":1616410364340,"timestampCreated":1616148777117,"uid":"hBTKSBNWcubLDB5MxmRrGizWrcw2"},{"key":"zH2Ld5WXOPeICJTG55Gwc7P7Jll1","dateCreated":"2021-04-23T06:45:07.974Z","email":"valluri@test.com","firstName":"krishna","lastName":"valluri","profilePicData":{"name":"wait.png","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FzH2Ld5WXOPeICJTG55Gwc7P7Jll1%2Fwait.png?alt=media&token=2ba487b0-82ce-49a7-b63a-bda6d5375087"},"status":"online","timeStampWhenActive":1619767291528,"timestampCreated":1619160307974,"uid":"zH2Ld5WXOPeICJTG55Gwc7P7Jll1"},{"key":"nlWaVobTCNUschTzvLMW5K60Pbj1","dateCreated":"2021-04-30T04:27:38.141Z","email":"nk06@yopmail.com","firstName":"lee","lastName":"son","profilePicData":{"name":"18f957e0-4293-11e8-be46-91b69c5ea416-laravel-framework-logo-C10176EC8C-seeklogo.com.png","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FnlWaVobTCNUschTzvLMW5K60Pbj1%2F18f957e0-4293-11e8-be46-91b69c5ea416-laravel-framework-logo-C10176EC8C-seeklogo.com.png?alt=media&token=a1d49967-1925-4bfe-8e0f-ab7b84418cf1"},"status":"logedOut","timeStampWhenActive":1619764825290,"timestampCreated":1619756858141,"uid":"nlWaVobTCNUschTzvLMW5K60Pbj1"},{"key":"5uIrFLtfUrQmCM9KrTeRXQqzADu1","chatList":{"-Mb7YCBmOQZbYHZ3yeBl":{"chatKey":"5Lzl4TeyL2b70bbBiIWwgwhG0qz1_5uIrFLtfUrQmCM9KrTeRXQqzADu1","lastUpdatedOn":1622567245939,"users":["5uIrFLtfUrQmCM9KrTeRXQqzADu1","5Lzl4TeyL2b70bbBiIWwgwhG0qz1"]}},"dateCreated":"2021-06-01T17:06:50.407Z","email":"maruf@gmail.com","firstName":"maruf","lastName":"shafique","status":"away","timeStampWhenActive":1622567318925,"timestampCreated":1622567210407,"uid":"5uIrFLtfUrQmCM9KrTeRXQqzADu1"},{"key":"KuJduxne6eO9TAn9HTCEVupPv0y2","dateCreated":"2021-04-02T06:35:45.111Z","email":"marufshafique98@gmail.com","firstName":"maruf","lastName":"shafique","profilePicData":{"name":"notifications-black-18dp.svg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FKuJduxne6eO9TAn9HTCEVupPv0y2%2Fnotifications-black-18dp.svg?alt=media&token=b2a83731-bde5-4140-949d-a824dd58e58f"},"status":"offline","timeStampWhenActive":1623304485960,"timestampCreated":1617345345111,"uid":"KuJduxne6eO9TAn9HTCEVupPv0y2"},{"key":"9WDNxkITt1ghCQVRYhOsCPNKOPX2","dateCreated":"2021-03-24T12:51:22.844Z","email":"nratnawat@isystango.com","firstName":"neerav","lastName":"ratnawat","profilePicData":{"name":"steve.jpeg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2F9WDNxkITt1ghCQVRYhOsCPNKOPX2%2Fsteve.jpeg?alt=media&token=d57b3f25-85c4-485f-9397-b5b9579c8587"},"status":"logedOut","timeStampWhenActive":1619791481949,"timestampCreated":1616590282844,"uid":"9WDNxkITt1ghCQVRYhOsCPNKOPX2"},{"key":"AEkeRwNK5Xb0ItXQOlDshXYLSQ93","dateCreated":"2021-04-26T11:15:51.295Z","email":"nk03@yopmail.com","firstName":"nikhat","lastName":"khan","profilePicData":{"name":"th (2).jpg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FAEkeRwNK5Xb0ItXQOlDshXYLSQ93%2Fth%20(2).jpg?alt=media&token=44efee76-127e-465f-afba-61024edc6b76"},"status":"away","timeStampWhenActive":1619793566060,"timestampCreated":1619435751295,"uid":"AEkeRwNK5Xb0ItXQOlDshXYLSQ93"},{"key":"iiH0CYeY3nc3IQ5pwztxNZXz5Ts2","dateCreated":"2021-04-27T06:46:25.536Z","email":"nk04@yopmail.com","firstName":"nikhat","lastName":"khan","profilePicData":{"name":"images (1).jpg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FiiH0CYeY3nc3IQ5pwztxNZXz5Ts2%2Fimages%20(1).jpg?alt=media&token=6bc0a068-1524-4950-8278-4f8b5a77754e"},"status":"away","timeStampWhenActive":1619776211825,"timestampCreated":1619505985536,"uid":"iiH0CYeY3nc3IQ5pwztxNZXz5Ts2"},{"key":"cqucaCoa14blM814IIU3l2buHpy1","dateCreated":"2021-04-29T05:40:58.786Z","email":"nk05@yopmail.com","firstName":"nk","lastName":"nk2","profilePicData":{"name":"icons8-chair-armchair-furniture-interior-33-64.png","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FcqucaCoa14blM814IIU3l2buHpy1%2Ficons8-chair-armchair-furniture-interior-33-64.png?alt=media&token=b44a5e40-74e9-4acf-95b9-deaa0947550b"},"status":"logedOut","timeStampWhenActive":1619764709862,"timestampCreated":1619674858786,"uid":"cqucaCoa14blM814IIU3l2buHpy1"},{"key":"FcIcqdkqNsakgzTwa3GOBqA1LaA2","dateCreated":"2021-04-05T13:36:29.275Z","email":"nikhat02@yopmail.com","firstName":"nk124","lastName":"nk1234","status":"away","timeStampWhenActive":1617632120321,"timestampCreated":1617629789275,"uid":"FcIcqdkqNsakgzTwa3GOBqA1LaA2"},{"key":"D4LgA0HvB3a39Te9PKqWDqmDAas1","dateCreated":"2021-03-17T16:35:25.589Z","email":"peter@yopmail.com","firstName":"peter","lastName":"parker","profilePicData":{"name":"model.jpg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FD4LgA0HvB3a39Te9PKqWDqmDAas1%2Fmodel.jpg?alt=media&token=66beb427-5a28-4828-85da-d8eaba7029f7"},"status":"online","timeStampWhenActive":1619710795204,"timestampCreated":1615998925589,"uid":"D4LgA0HvB3a39Te9PKqWDqmDAas1"},{"key":"jsKYNIR7KVXkgrzIociUvGZ1Qrw1","dateCreated":"2021-03-25T06:12:27.357Z","email":"rahul@yopmail.com","firstName":"rahul","lastName":"d","status":"logedOut","timeStampWhenActive":1616652765507,"timestampCreated":1616652747357,"uid":"jsKYNIR7KVXkgrzIociUvGZ1Qrw1"},{"key":"sTzeFNYfTAX4fDVCutF6X3BRhkv1","dateCreated":"2021-03-24T12:58:32.156Z","email":"sratnawat@yopmail.com","firstName":"sandesh","lastName":"ratnawat","profilePicData":{"name":"profilePic2.jpeg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FsTzeFNYfTAX4fDVCutF6X3BRhkv1%2FprofilePic2.jpeg?alt=media&token=cf90e8b8-48a1-469e-b9c0-b59270a66104"},"status":"logedOut","timeStampWhenActive":1618567156621,"timestampCreated":1616590712156,"uid":"sTzeFNYfTAX4fDVCutF6X3BRhkv1"},{"key":"iEinneBlzcXJlBfjZu8sxqc6f2x1","dateCreated":"2021-03-17T06:45:43.218Z","email":"steve@yopmail.com","firstName":"steve","lastName":"rogers","profilePicData":{"name":"lotus-978659_1920.jpg","url":"https://firebasestorage.googleapis.com/v0/b/mtalk-15b6e.appspot.com/o/profilePictures%2FiEinneBlzcXJlBfjZu8sxqc6f2x1%2Flotus-978659_1920.jpg?alt=media&token=2d00990a-cbea-413a-85e9-2c43f3efce19"},"status":"online","timeStampWhenActive":1619702005241,"timestampCreated":1615963543218,"uid":"iEinneBlzcXJlBfjZu8sxqc6f2x1"},{"key":"Xghd3wKQ9bZEPpACkEMP4LcnCzo2","chatList":{"-Mc_3DmAeV0ezxRpXnnD":{"chatKey":"BCQPUuYMicVB0RzfL9ycIpjzNpD2_Xghd3wKQ9bZEPpACkEMP4LcnCzo2","lastUpdatedOn":1624119503074,"users":["Xghd3wKQ9bZEPpACkEMP4LcnCzo2","BCQPUuYMicVB0RzfL9ycIpjzNpD2"]}},"dateCreated":"2021-04-02T06:36:30.455Z","email":"muppa.t11@gmail.com","firstName":"teja","lastName":"muppa","status":"online","timeStampWhenActive":1624373122494,"timestampCreated":1617345390455,"uid":"Xghd3wKQ9bZEPpACkEMP4LcnCzo2"}];
     this.contactList = users;
     this.addContactList = this.contactList.filter((user: any) => user.uid !== this.userId);
      this.addContactList= this.addContactList.filter((list: any) => {
          return !this.contactIdDetails.sender.groupmembers.find((member: any) => {
              return member.uid == list.uid;
          });
      });
   }

   checkIfNewAlphabet(firstName: string){
    if(this.currentAlphabet === firstName.charAt(0).toLowerCase()){
      return false;
    }else{
      this.currentAlphabet = firstName.charAt(0).toLowerCase();
      return true;
    }
  }

  selectMember(member: any) {
  let selectMembers: any = this.selectMembersList.filter((obj: any) => obj.key === member.key);
   if (selectMembers.length === 0) {
    this.selectMembersList.push(member);
   }
  }

  removeMemberList(member: any, index: number) {
    this.selectMembersList.splice(index, 1);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
