using System;
using VeryPDFCom;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
        }

        private void button1_Click(object sender, EventArgs e)

        {
            
            string strExeFile = "D:\\downloads\\VeryPDFComRunCmd\\swf2img\\swf2img2.exe";

            string strInFile = "D:\\downloads\\VeryPDFComRunCmd\\swf2img\\colortest.swf";

            string strOutFile = "D:\\downloads\\VeryPDFComRunCmd\\swf2img\\colortest.jpg";



            string strCmd = "\"" + strExeFile + "\" \"" + strInFile + "\" \"" + strOutFile + "\"";



            System.Type VeryPDFType = System.Type.GetTypeFromProgID("VeryPDFCom.RunCmd");

            VeryPDFCom.RunCmd VeryPDFCom = (VeryPDFCom.RunCmd)System.Activator.CreateInstance(VeryPDFType);

            string strReturn = VeryPDFCom.RunCmd2(strCmd, 1);

        }

    }
}
