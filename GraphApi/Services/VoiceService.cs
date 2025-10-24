// using System;
// using System.IO;
// using System.Speech.Synthesis;

// namespace GraphApi.Services
// {
//     public class VoiceService
//     {
//         private readonly string _voiceDir;

//         public VoiceService()
//         {
//             _voiceDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "voices");
//             Directory.CreateDirectory(_voiceDir);
//         }

//         public string GenerateVoice(string text)
//         {
//             // Tạo tên file duy nhất
//             var fileName = $"{Guid.NewGuid()}.wav";
//             var filePath = Path.Combine(_voiceDir, fileName);

//             using (var synth = new SpeechSynthesizer())
//             {
//                 // Giọng tiếng Việt (nếu có)
//                 try
//                 {
//                     synth.SelectVoiceByHints(VoiceGender.Female, VoiceAge.Adult, 0,
//                         new System.Globalization.CultureInfo("vi-VN"));
//                 }
//                 catch
//                 {
//                     // fallback nếu không có giọng Việt
//                     synth.SelectVoiceByHints(VoiceGender.Female);
//                 }

//                 synth.Rate = -1;  // đọc chậm
//                 synth.Volume = 100;
//                 synth.SetOutputToWaveFile(filePath);
//                 synth.Speak(text);
//             }

//             // Trả URL tương đối để frontend dùng
//             return $"/voices/{fileName}";
//         }
//     }
// }



using System;
using System.IO;
using System.Speech.Synthesis;

namespace GraphApi.Services
{
    public class VoiceService
    {
        private readonly string _voiceDir;

        public VoiceService()
        {
            _voiceDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "voices");
            Directory.CreateDirectory(_voiceDir);
        }

        public string GenerateVoice(string text)
        {
            var fileName = $"{Guid.NewGuid()}.wav";
            var filePath = Path.Combine(_voiceDir, fileName);

            using (var synth = new SpeechSynthesizer())
            {
                try
                {
                    synth.SelectVoiceByHints(VoiceGender.Female, VoiceAge.Adult, 0,
                        new System.Globalization.CultureInfo("vi-VN"));
                }
                catch
                {
                    synth.SelectVoiceByHints(VoiceGender.Female);
                }

                synth.Rate = -1;
                synth.Volume = 100;
                synth.SetOutputToWaveFile(filePath);
                synth.Speak(text);
            }

            return $"/voices/{fileName}";
        }
    }
}
