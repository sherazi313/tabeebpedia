<?php
/*
Plugin Name: Pulse Diagnosis
Plugin URI: https://nuktaguidance.com/
Description: A calculator plugin to diagnose temperament and disease by pulse.
Version: 1.5
Author: S.A.Wahab
Author URI: https://nuktaguidance.com/
License: GPL2
*/

// Enqueue scripts and styles
function pulse_diagnosis_enqueue_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_style('pulse-diagnosis-style', plugin_dir_url(__FILE__) . 'style.css');
}
add_action('wp_enqueue_scripts', 'pulse_diagnosis_enqueue_scripts');

// Shortcode to display the diagnosis form
function pulse_diagnosis_form() {
    ob_start(); ?>
    <div id="pulse-diagnosis-form">
        <h1>نبض کی تشخیص</h1>
        <form id="diagnosis-questions">
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 1:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کا مقام محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question1" value="عضلاتی" onclick="hideContrasts(1)"> نبض باالکل اوپر، انگلی رکھتے ہی محسوس ہو رہی ہے۔ کبھی آنکھوں سے بھی ہلتی نظر آتی ہے۔</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question1" value="غدی" onclick="hideContrasts(1)"> نبض باالکل اوپر نہیں، ہلکا سا دباو دینے پر محسوس ہوتی ہے۔(درمیان)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question1" value="اعصابی" onclick="hideContrasts(1)"> نبض ہلکہ سا دباو دینے  سے بھی محسوس نہیں ہوتی بہت زیادہ دباو دینے پر نیچے محسوس ہوتی ہے۔</label>
            </div>
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 2:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کی لمبائی کو محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question2" value="عضلاتی" onclick="hideContrasts(2)">  نبض کی لمبائی چار انگلیاں یا اس بھی زیادہ لمبی ہے۔</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question2" value="غدی" onclick="hideContrasts(2)">  نبض کی لمبائی دو انگلی یا تین انگلی تک ہے۔تین سے زیادہ نہیں۔</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question2" value="اعصابی" onclick="hideContrasts(2)">  نبض کی لمبائی ایک انگلی یا دیڑھ انگلی ہے۔(حرارت باالکل نہیں)</label>
            </div>
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 3:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کا حجم محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question3" value="عضلاتی" onclick="hideContrasts(3)"> نبض چوڑی نہیں ہے بلکہ دھاگے کی طرح باریک ہے۔(نصف پورے سے کم)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question3" value="غدی" onclick="hideContrasts(3)"> نبض  معمولی چوڑی ہے۔یعنی دو یا تین دھاگوں  کے برابر(نصف پورے تک)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question3" value="اعصابی" onclick="hideContrasts(3)"> نبض زیادہ چوڑی  اور نرم ہے۔(نصف پورے سے زیادہ)</label>
            </div>
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 4:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کی رفتار محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question4" value="عضلاتی" onclick="hideContrasts(4)"> نبض بہت تیز رفتار ہے۔(سریع)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question4" value="غدی" onclick="hideContrasts(4)"> رفتار سست یا درمیانی ہے، مگر نبض تنگ ہے۔</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question4" value="اعصابی" onclick="hideContrasts(4)"> رفتار سست ہے، مگر نبض چوڑی ہے۔(سست) </label>
            </div>
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 5:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کی ٹھوکر محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question5" value="عضلاتی" onclick="hideContrasts(5)"> نبض زور دار ٹھوکر مارتی ہے گویا انگلیوں کو اٹھا دیتی ہے۔(قوی)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question5" value="غدی" onclick="hideContrasts(5)"> نبض کی ٹھوکر معمولی یا درمیانی  ہے، مگر نبض تنگ ہے۔(ضعیف)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question5" value="اعصابی" onclick="hideContrasts(5)"> نبض کی ٹھوکر  معمولی ہے، مگر نبض چوڑی ہے۔۔(ضعیف)</label>
            </div>
            <div class="question">
                <h2 style="font-weight: bold; font-size: 20px;">سوال 6:</h2>
                <h3 style="font-weight: bold; font-size: 18px;">نبض کے سختی کو محسوس کریں:</h3>
                <label style="font-weight: bold;"><input type="radio" name="question6" value="عضلاتی" onclick="hideContrasts(6)"> نبض بہت سخت ہے۔(صلب)</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question6" value="غدی" onclick="hideContrasts(6)"> نبض معتدل ہے۔</label><br>
                <label style="font-weight: bold;"><input type="radio" name="question6" value="اعصابی" onclick="hideContrasts(6)">  نبض بہت نرم ہے۔(لین)</label>
            </div>
            <button type="button" class="submit-btn" onclick="calculateDiagnosis()">تشخیص کریں</button>
        </form>
        <div id="diagnosis-result" style="display:none;">
            <h3>آپ کی نبض ہے:</h3>
            <p id="result-text"></p>
        </div>
    </div>

    <script>
        function hideContrasts(questionNumber) {
            // Logic to hide contrasting options can be implemented here
        }

        function calculateDiagnosis() {
            const answers = [];
            for (let i = 1; i <= 6; i++) {
                const selected = document.querySelector(`input[name="question${i}"]:checked`);
                if (selected) {
                    answers.push(selected.value);
                }
            }

            const counts = {};
            answers.forEach(answer => {
                counts[answer] = (counts[answer] || 0) + 1;
            });

            // Sort answers by frequency
            const sortedAnswers = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            let result = '';

            // Create the result string
            if (sortedAnswers.length > 0) {
                result += sortedAnswers[0][0]; // Most common
                if (sortedAnswers.length > 1) {
                    result += ' ' + sortedAnswers[1][0]; // Second most common
                }
            }

            document.getElementById('result-text').innerText = result;
            document.getElementById('diagnosis-result').style.display = 'block';
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('pulse_diagnosis', 'pulse_diagnosis_form');
?>
