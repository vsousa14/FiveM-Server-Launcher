using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using System.Drawing.Text;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Reflection;
using System.Threading;

namespace FiveMServerLauncher
{
    public partial class Form1 : Form
    {
        public string ipSRV = "localhost:30120";
        public string DiscordLink = "https://discord.gg/GWZsjkJ";
        public string ts3IP = "54.38.167.162:2861";
        public Form1()
        {
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.BackColor = Color.Black;
            this.TransparencyKey = Color.Black;
            InitializeComponent();
            InitCustomLabelFont();
        }

        public void InitCustomLabelFont()
        {

            PrivateFontCollection pfc = new PrivateFontCollection();

            int fontLength = Properties.Resources.pricedown_bl.Length;

            byte[] fontdata = Properties.Resources.pricedown_bl;

            System.IntPtr data = Marshal.AllocCoTaskMem(fontLength);

            Marshal.Copy(fontdata, 0, data, fontLength);

            pfc.AddMemoryFont(data, fontLength);

            label1.Font = new Font(pfc.Families[0], label1.Font.Size);
            label2.Font = new Font(pfc.Families[0], label2.Font.Size);
            label3.Font = new Font(pfc.Families[0], label3.Font.Size);
            label4.Font = new Font(pfc.Families[0], label4.Font.Size);

        }

        private void button1_Click(object sender, EventArgs e)
        {
            Close();
        }
        private string responseFromServer;
        private string status;
        private string svCon;
        bool ipServ = false;
        private void Form1_Load(object sender, EventArgs e)
        {

            label1.Parent = pictureBox1;
            label1.BackColor = Color.Transparent;
            label2.Parent = pictureBox1;
            label2.BackColor = Color.Transparent;
            label3.Parent = pictureBox1;
            label3.BackColor = Color.Transparent;
            label4.Parent = pictureBox1;
            label4.BackColor = Color.Transparent;
            pictureBox2.Parent = pictureBox1;
            pictureBox2.BackColor = Color.Transparent;
            pictureBox3.Parent = pictureBox1;
            pictureBox3.BackColor = Color.Transparent;


            //---------------------------------------------------------------------------
            svCon = "http://" + ipSRV + "/players.json";
            WebRequest request = WebRequest.Create(svCon);
            request.Credentials = CredentialCache.DefaultCredentials;
            ipServ = isExist(svCon);
            if (ipServ)
            {
                WebResponse response = request.GetResponse();
                status = ((HttpWebResponse)response).StatusDescription;
                Console.WriteLine(status);

                using (Stream dataStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(dataStream);
                    responseFromServer = reader.ReadToEnd();
                    Console.WriteLine(responseFromServer);


                }

              
                response.Close();
                label2.Text = "Online";
                label2.ForeColor = System.Drawing.Color.Green;
                Player[] item = JsonConvert.DeserializeObject<Player[]>(responseFromServer);
                var countPlayers = item.Count();
                label3.Text = countPlayers.ToString()+" Connected Players";
                label3.Size = new Size(496, 25);






            }
            else
            {
                label2.Text = "Offline";
                label2.ForeColor = System.Drawing.Color.Red;
                label3.Text = "Join our Discord or TS3 for further information";
                label4.Visible = false;
            }


        }

        //----------------------------------------------------------------------------------------------------------

        private bool isExist(string ipSRV)
        {
            WebRequest webRequest = HttpWebRequest.Create(svCon);
            webRequest.Method = "HEAD";
            try
            {
                using (WebResponse webResponse = webRequest.GetResponse())
                {
                    return true;
                }
            }
            catch //(WebException ex)
            {
                return false;
            }
        }

        //-------------------------------------------------------------------------------------------------------------

        public class Player
        {
            public string endpoint { get; set; }
            public int id { get; set; }
            public string[] identifiers { get; set; }
            public string name { get; set; }
            public int ping { get; set; }
        }

        private void label4_MouseHover(object sender, EventArgs e)
        {
            label4.ForeColor = Color.DimGray;
            
        }

        private void label4_MouseLeave(object sender, EventArgs e)
        {
            label4.ForeColor = Color.White;
        }

        private void label4_Click(object sender, EventArgs e)
        {
            Process[] steam = Process.GetProcessesByName("steam");
            if (steam.Length == 0)
            {
                MessageBox.Show("You must have your steam running.");
                Close();
            }
            else
            {

                System.Diagnostics.Process process = new System.Diagnostics.Process();
                System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
                startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                startInfo.FileName = "cmd.exe";
                startInfo.Arguments = "/C Start fivem://connect/" + ipSRV;
                process.StartInfo = startInfo;
                process.Start();
                Thread.Sleep(3000);
                Close();


            }
        }

        private void pictureBox2_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start(DiscordLink);
        }

        private void pictureBox3_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("ts3server://"+ts3IP);
        }
    }
}
