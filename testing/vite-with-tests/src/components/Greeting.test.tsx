import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Greeting from "./Greeting";

describe("<Greeting /> Test(s)", () => {
  test("Render -> <Greeting title='hello world' message='how are you' />", () => {
    //Arrange
    render(<Greeting title="hello world" message="how are you" />);

    // Act
    const titleElement = screen.getByText("hello world");
    const messageElement = screen.getByText("how are you");

    // Assert
    expect(titleElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
  });
  test("renders -> Default (count) value of 0 on page load", () => {
    //Arrange
    render(<Greeting title="hello world" message="how are you" />);
    //Act
    const count_element = screen.getByTestId("count");
    let count = count_element.textContent;
    //Assert
    expect(count).toBe("0");
  });

  test("Render -> Clicking on + button 5 times count should be 5", async () => {
    //Arrange
    render(<Greeting title="hello world" message="how are you" />);
    //Act
    const inc_element = screen.getByTestId("inc");
    //console.log(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    const count_element = screen.getByTestId("count");
    let count = count_element.textContent;
    //Assert
    expect(count).toBe("5");
  })
  test("Render -> Clicking on + button 5 times and - button 3 times count should be 2", async () => {
    //Arrange
    render(<Greeting title="hello world" message="how are you" />);
    //Act
    const inc_element = screen.getByTestId("inc");
    const dec_element = screen.getByTestId("dec");
    //5 + button clicks
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    await userEvent.click(inc_element);
    // 3 - button clicks
    await userEvent.click(dec_element);
    await userEvent.click(dec_element);
    await userEvent.click(dec_element);
    const count_element = screen.getByTestId("count");
    let count = count_element.textContent;
    //Assert
    expect(count).toBe("2");
  })
});