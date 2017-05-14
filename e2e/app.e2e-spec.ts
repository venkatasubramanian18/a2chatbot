import { ChatbotPage } from './app.po';

describe('chatbot App', () => {
  let page: ChatbotPage;

  beforeEach(() => {
    page = new ChatbotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
