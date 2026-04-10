import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity  //with this annotation hibernate will treat this as a table
@Table(name="users")//this maps it to the users table in the db
@Data//it is a lambok function and is basically used for generating getters and setter functions
    //without this annotation we have to adder add annotation @Getter and @Setter or manually write the function
public class User {
    @Id  //this to mark the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY)  //this auto increment strategy in spring-boot
    private Integer userID;

    private String name;
    private String email;
    private String password;
    private String branch;
    private String semester;
    @CreationTimestamp
    private Timestamp createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;

}
