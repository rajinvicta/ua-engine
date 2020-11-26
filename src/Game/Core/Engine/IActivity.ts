interface IActivity {
  name: string;
  code: string;
  startActivity(scriptName: string): void;
}

export default IActivity;