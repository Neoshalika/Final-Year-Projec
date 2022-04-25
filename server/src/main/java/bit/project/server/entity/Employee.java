package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String photo;

    private LocalDate dorecruit;

    private LocalDate dobirth;

    private String nic;

    private String mobile;

    private String land;

    private String email;

    private String etfno;

    private BigDecimal daysalary;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Civilstatus civilstatus;

    @ManyToOne
    private Designation designation;

    @ManyToOne
    private Employeestatus employeestatus;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Advancedpayment> employeeAdvancedpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Attendance> employeeAttendanceList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Loan> employeeLoanList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Prorderemployee> prorderemployeeList;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Salary> employeeSalaryList;

/*
    @OneToMany(mappedBy = "employee")
    @JsonIgnoreProperties({"creator","employee","roleList","failedattempts"})
    private List<User> employeeUserList;*/


    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Delivery> deliveryList;




    public Employee(Integer id){
        this.id = id;
    }

    public Employee(Integer id, String code, Nametitle nametitle, String callingname, String photo){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
        this.photo = photo;
    }

}
