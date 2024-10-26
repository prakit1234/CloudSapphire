<script>
  import "./style.css";

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Dashboard</title>
  <link rel="stylesheet" href="style.css" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="dashboard-container">
  <header>
    <img
      src="https://generated-assets.prod.myninja.ai/296b81c6-e91d-418a-9582-ec1771bf02c4/9622aafc-88ed-48ff-a652-1b06298a6b40_2.jpeg"
      alt="Logo"
      class="logo"
    />
    <!-- Replace with your logo -->
    <h1 class="dashboard-title">Cloud Sapphire Dashboard</h1>
    <button
      id="toggleDarkMode"
      class="dark-mode-toggle"
      on:click={toggleDarkMode}>🌓</button
    >
  </header>
  <p class="dashboard-description">
    Welcome! Easily navigate various storage options below.
  </p>
  <div class="options-container">
    <a class="option-box" href="/main">
      <h2 class="option-title">Cloud Sapphire File IO Usage</h2>
      <p class="option-description">File.io with secure file handling.</p>
    </a>
    <a class="option-box" href="/main">
      <h2 class="option-title">Cloud ZENFIRE</h2>
      <p class="option-description">Faster and more efficient uploads.</p>
    </a>
    <a class="option-box" href="/main">
      <h2 class="option-title">Cloud Zapfire</h2>
      <p class="option-description">Stored for up to 5 months securely.</p>
    </a>
  </div>
</div>
